import Client from '../models/ClientModel.js';

// Create a new client
export const createClient = async (req, res) => {
  try {
    const { name, email, phone, location,zipCode } = req.body;

    // Check if the client already exists
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }

    // Create the new client
    const client = new Client({ name, email, phone, location,zipCode });
    await client.save();

    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};
