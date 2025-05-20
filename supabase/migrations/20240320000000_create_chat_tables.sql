-- Create enum for agent types
CREATE TYPE agent_type AS ENUM ('general', 'nutrition', 'assessment', 'analysis', 'creative');

-- Create enum for message roles
CREATE TYPE message_role AS ENUM ('system', 'user', 'assistant');

-- Create table for chat sessions
CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    pet_id UUID NOT NULL REFERENCES pet_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for messages
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    role message_role NOT NULL,
    agent_type agent_type NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    images TEXT[], -- Array of base64 encoded images
    has_more_files BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_chat_sessions_pet_id ON chat_sessions(pet_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_user_pet ON chat_sessions(user_id, pet_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 