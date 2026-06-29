const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { getPublicId } = require("../utils/cloudinaryHelper");
const fs = require("fs");
const path = require("path");

const {
  generateInsights,
  generateSearchFilters
} = require(
  "../services/aiService"
);

const dashboardStatsQuery = `
  SELECT
    COUNT(*) AS total,
    SUM(status='Delivered') AS delivered,
    SUM(condition_status='Damaged') AS damaged
  FROM delivery_proofs
`;

// CREATE DELIVERY
const createDelivery = (req, res) => {
  const {
    tracking_id,
    receiver_name,
    status,
    condition_status,
    remarks
  } = req.body;

  const proof_images =
    req.files && req.files.length > 0
      ? JSON.stringify(
          req.files.map((file) => file.path)
        )
      : JSON.stringify([]);

  const sql = `
    INSERT INTO delivery_proofs
    (
      tracking_id,
      receiver_name,
      status,
      condition_status,
      remarks,
      proof_images,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      tracking_id,
      receiver_name,
      status,
      condition_status,
      remarks,
      proof_images,
      req.user.id
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to save delivery"
        });
      }

      res.status(201).json({
        message: "Delivery saved successfully"
      });

    }
  );
};

// GET ALL DELIVERIES
const getAllDeliveries = (req, res) => {

  const sql =
    "SELECT * FROM delivery_proofs ORDER BY id DESC";

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch deliveries"
      });
    }

    res.status(200).json(results);

  });

};

// GET SINGLE DELIVERY
const getDeliveryById = (req, res) => {

  const { id } = req.params;

  const sql =
    "SELECT * FROM delivery_proofs WHERE id = ?";

  db.query(sql, [id], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch delivery"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Delivery not found"
      });
    }

    res.status(200).json(results[0]);

  });

};

// UPDATE DELIVERY
const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      tracking_id,
      receiver_name,
      status,
      condition_status,
      remarks,
      existingImages
    } = req.body;

    const oldImages =
      existingImages
        ? JSON.parse(existingImages)
        : [];

    const newImages =
      req.files
        ? req.files.map((file) => file.path)
        : [];

    const proof_images =
      JSON.stringify([
        ...oldImages,
        ...newImages
      ]);

    const [results] = await db.promise().query(
      "SELECT proof_images FROM delivery_proofs WHERE id = ?",
      [id]
    );

    let previousImages = [];

    try {
      previousImages = JSON.parse(
        results[0]?.proof_images || "[]"
      );
    } catch {
      previousImages = [];
    }

    const removedImages = previousImages.filter(
      (image) => !oldImages.includes(image)
    );

    for (const image of removedImages) {
      if (
        image &&
        image.startsWith("https://res.cloudinary.com")
      ) {
        try {
          const publicId = getPublicId(image);

          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted: ${publicId}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    const sql = `
      UPDATE delivery_proofs
      SET
        tracking_id = ?,
        receiver_name = ?,
        status = ?,
        condition_status = ?,
        remarks = ?,
        proof_images = ?,
        updated_by = ?
      WHERE id = ?
    `;

    const values = [
      tracking_id,
      receiver_name,
      status,
      condition_status,
      remarks,
      proof_images,
      req.user.id,
      id
    ];

    await db.promise().query(sql, values);

    res.status(200).json({
      message: "Delivery updated successfully"
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to update delivery"
    });
  }
};

// DELETE DELIVERY
const deleteDelivery = async (req, res) => {

  const { id } = req.params;

  db.query(
    "SELECT proof_images FROM delivery_proofs WHERE id = ?",
    [id],
    async (err, results) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to fetch images"
        });
      }

      if (results.length > 0) {

        let images = [];

        try {
          images = JSON.parse(
            results[0].proof_images || "[]"
          );
        } catch {
          images = [];
        }

        for (const image of images) {
          if (
            image &&
            image.startsWith("https://res.cloudinary.com")
          ) {
            try {
              const publicId = getPublicId(image);
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                console.log(
                  `Deleted Cloudinary image: ${publicId}`
                );
              }
            } catch (error) {
              console.error(
                "Cloudinary delete failed:",
                error
              );
            }
          }
        }

      }

      db.query(
        "DELETE FROM delivery_proofs WHERE id = ?",
        [id],
        (err) => {

          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Failed to delete delivery"
            });
          }

          res.status(200).json({
            message: "Delivery deleted successfully"
          });

        }
      );

    }
  );

};

// DASHBOARD STATS
const getStats = (req, res) => {

  const sql = dashboardStatsQuery;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch stats"
      });
    }

    res.status(200).json({
      total: results[0].total || 0,
      delivered: results[0].delivered || 0,
      damaged: results[0].damaged || 0
    });

  });

};

const getAIInsights = async (req, res) => {

  try {

    const sql = dashboardStatsQuery;

    db.query(sql, async (err, results) => {

      if (err) {
        return res.status(500).json({
          message: "Failed to fetch stats"
        });
      }

      const stats = {
        total: Number(results[0].total || 0),
        delivered: Number(results[0].delivered || 0),
        damaged: Number(results[0].damaged || 0)
      };
      console.log("Stats:", stats);
      console.log("Type Total:", typeof stats.total);
      console.log("Type Delivered:", typeof stats.delivered);
      console.log("Type Damaged:", typeof stats.damaged);

      try {
        const aiResponse = await generateInsights(stats);
        res.json({ mode: aiResponse.mode, insight: aiResponse.data });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "AI generation failed"
        });
      }

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI generation failed"
    });
  }

};

const searchByAI = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const aiResponse = await generateSearchFilters(query);
    const filters = aiResponse.filters;
    
    let sql = "SELECT * FROM delivery_proofs WHERE 1=1";
    const values = [];

    if (filters.status) {
      sql += " AND status = ?";
      values.push(filters.status);
    }
    if (filters.condition_status) {
      sql += " AND condition_status = ?";
      values.push(filters.condition_status);
    }
    if (filters.search) {
      sql += " AND (receiver_name LIKE ? OR tracking_id LIKE ?)";
      values.push(`%${filters.search}%`);
      values.push(`%${filters.search}%`);
    }

    if (filters.dateRange) {
      if (filters.dateRange === "today") {
        sql += " AND DATE(delivery_time) = CURDATE()";
      } else if (filters.dateRange === "this_week") {
        sql += " AND YEARWEEK(delivery_time, 1) = YEARWEEK(CURDATE(), 1)";
      } else if (filters.dateRange === "this_month") {
        sql += " AND YEAR(delivery_time) = YEAR(CURDATE()) AND MONTH(delivery_time) = MONTH(CURDATE())";
      } else if (filters.dateRange === "yesterday") {
        sql += " AND DATE(delivery_time) = SUBDATE(CURDATE(), 1)";
      }
    }

    sql += " ORDER BY id DESC";

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("AI Search DB Error:", err);
        return res.status(500).json({ message: "Database error during AI search" });
      }
      res.status(200).json({
        mode: aiResponse.mode,
        filters,
        results
      });
    });

  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ message: "Failed to process AI search" });
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  getStats,
  getAIInsights,
  searchByAI
};