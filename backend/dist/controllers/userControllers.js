import { getUserByName } from "../models/userModels.js";
export async function handleGetUser(req, res) {
    try {
        const { search } = req.query;
        if (typeof search !== 'string') {
            res.json({ success: true, message: "No search term", data: [] });
            return;
        }
        if (!search || search.trim() === '') {
            res.json({ success: true, message: "No search term", data: [] });
            return;
        }
        const newGetUser = await getUserByName(search);
        res.status(201).json({
            success: true,
            message: "Succesfully retrieved username:",
            data: newGetUser
        });
    }
    catch (error) {
        console.error("Error in get user controller", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong on server",
        });
    }
}
