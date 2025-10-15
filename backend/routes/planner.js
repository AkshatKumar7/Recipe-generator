import express from "express";
import axios from "axios";
import Goal from "../models/goal.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const plannerRouter = express.Router();


plannerRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { goalText } = req.body;
    const userId = req.userId;

    if (!goalText) {
      return res.status(400).json({ message: "Goal text is required" });
    }

    // LLM reasoning prompt
    const prompt = `
    Break down this goal into actionable tasks with suggested deadlines and dependencies.
    You are a JSON-only generator. Return ONLY valid JSON (an array). Do not include backticks or any text before/after the JSON.
    Goal: "${goalText}"
    Output format (JSON):
    [
      {
        "title": "",
        "description": "",
        "estimatedDays": 0,
      }
    ]
    `;

    // 🔮 Call LLM API (e.g. OpenAI)
    const llmResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = llmResponse?.data?.choices?.[0]?.message?.content || "";
    let tasks;

    try {
      tasks = JSON.parse(raw);

      // Ensure tasks is an array
      if (!Array.isArray(tasks)) throw new Error("LLM output is not an array");

      // Sanitize tasks: defaults & types
      tasks = tasks.map((t, i) => ({
        title: (t.title || `Task ${i + 1}`).toString().slice(0, 500),
        description: (t.description || "").toString(),
        estimatedDays: Number.isFinite(Number(t.estimatedDays)) ? Number(t.estimatedDays) : 1,
        dependsOn: [] // remove dependsOn to simplify Mongoose
      }));
    } catch (err) {
      console.error("LLM parsing error:", err);
      return res.status(500).json({
        message: "LLM response parsing error",
        error: err.message,
        raw: raw.length > 2000 ? raw.slice(0, 2000) + "..." : raw
      });
    }

    // Total estimated duration
    const totalDurationDays = tasks.reduce(
      (sum, t) => sum + (t.estimatedDays || 0),
      0
    );
    const newGoal = await Goal.create({
      user: userId,
      goalText,
      tasks,
      totalDurationDays,
      generatedByAI: true,
    });

    res.status(201).json({ message: "Goal created successfully", goal: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ message: "Server error" });
  }
});


plannerRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/goals/:id
 * @desc    Get single goal by ID
 * @access  Private
 */
plannerRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default plannerRouter;
