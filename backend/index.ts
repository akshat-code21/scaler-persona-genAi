import express, { type Response } from "express";
import cors from "cors";
import chatRouter from "./routes/chat";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/health", (_, res: Response) => {
	res.json({
		status: "OK",
	});
});

app.use("/api/v1/chat", chatRouter);

app.listen(3000, () => {
	console.log("Server up at port 3000");
});
