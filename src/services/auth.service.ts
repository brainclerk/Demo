import { User } from '../types/user';
import { supabase } from '../lib/supabase';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData extends LoginCredentials {
    name: string;
}

class AuthService {
    private static instance: AuthService;
    private currentUser: User | null = null;

    private constructor() {
        // Initialize session listener
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.setCurrentUserFromSession(session);
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
            }
        });
    }

    private setCurrentUserFromSession(session: any) {
        if (session.user) {
            this.currentUser = {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata.name || '',
                onboardingCompleted: session.user.user_metadata.onboardingCompleted || false,
                createdAt: session.user.created_at,
                updatedAt: session.user.updated_at || session.user.created_at,
                premium: session.user.user_metadata.premium || false,
                avatar: session.user.user_metadata.avatar || '',
                credits: session.user.user_metadata.credits || '0',
            };
        }
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(credentials: LoginCredentials): Promise<User> {
        try {
            console.log('Attempting login with:', { email: credentials.email });

            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });

            if (error) {
                console.error('Login error details:', error);
                // Check if the error is due to unconfirmed email
                if (error.message === 'Email not confirmed') {
                    throw new Error('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
                }
                throw error;
            }

            if (!data.user) {
                console.error('No user data returned');
                throw new Error('No user data returned');
            }

            if (!data.session) {
                console.error('No session data returned');
                throw new Error('No session data returned');
            }

            // Check if email is confirmed
            if (!data.user.email_confirmed_at) {
                throw new Error('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
            }

            console.log('Login successful, setting user data');
            this.setCurrentUserFromSession(data.session);
            return this.currentUser!;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async resendConfirmationEmail(email: string): Promise<void> {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) {
                console.error('Error resending confirmation email:', error);
                throw error;
            }
        } catch (error) {
            console.error('Resend confirmation email error:', error);
            throw error;
        }
    }

    async signInWithGoogle(): Promise<void> {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    }

    async signInWithFacebook(): Promise<void> {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Facebook sign in error:', error);
            throw error;
        }
    }

    async register(data: RegisterData): Promise<User> {
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        onboardingCompleted: false,
                        premium: false,
                        avatar: '',
                        credits: '0',
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('Registration error:', error);
                throw error;
            }

            if (!authData.user) {
                throw new Error('No user data returned');
            }

            // Send confirmation email
            await this.resendConfirmationEmail(data.email);

            const user: User = {
                id: authData.user.id,
                email: authData.user.email!,
                name: data.name,
                onboardingCompleted: false,
                createdAt: authData.user.created_at,
                updatedAt: authData.user.updated_at || authData.user.created_at,
                premium: false,
                avatar: '',
                credits: '0',
            };

            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            this.currentUser = null;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            // First check if we have a cached user
            if (this.currentUser) {
                return this.currentUser;
            }

            // Try to get the session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('Session error:', sessionError);
                return null;
            }

            if (session) {
                this.setCurrentUserFromSession(session);
                return this.currentUser;
            }

            return null;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    async updateOnboardingStatus(userId: string, completed: boolean): Promise<void> {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { onboardingCompleted: completed }
            });

            if (error) throw error;

            if (this.currentUser) {
                this.currentUser.onboardingCompleted = completed;
            }
        } catch (error) {
            console.error('Update onboarding status error:', error);
            throw error;
        }
    }

    isAuthenticated(): boolean {
        return !!this.currentUser;
    }
}

export const authService = AuthService.getInstance(); 