import React, { useState, type ChangeEvent } from 'react';

export default function App(): React.JSX.Element {
    const [file, setFile] = useState<File | null>(null);

    // Type the file input change event
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(() => e.target.files[0]);
        }
        console.log(file);
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!file) return alert('Please select a file first');

        const formData = new FormData();
        // 'file' matches the key name your backend expects
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <input type="file" name="avatar" onChange={handleFileChange} />
            <button type="submit">Submit</button>
        </form>
    );
}
