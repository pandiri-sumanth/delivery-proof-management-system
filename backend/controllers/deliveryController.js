const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const {
  generateInsights
} = require(
  "../services/geminiService"
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
          req.files.map((file) => file.filename)
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
      proof_images
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      tracking_id,
      receiver_name,
      status,
      condition_status,
      remarks,
      proof_images
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
const updateDelivery = (req, res) => {

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
      ? req.files.map((file) => file.filename)
      : [];

  const proof_images =
    JSON.stringify([
      ...oldImages,
      ...newImages
    ]);

  db.query(
    "SELECT proof_images FROM delivery_proofs WHERE id = ?",
    [id],
    (err, results) => {

      if (!err && results.length > 0) {

        let previousImages = [];

        try {
          previousImages =
            JSON.parse(
              results[0].proof_images || "[]"
            );
        } catch {
          previousImages = [];
        }

        const removedImages =
          previousImages.filter(
            (image) =>
              !oldImages.includes(image)
          );

        removedImages.forEach((image) => {
          const imagePath =
            path.join(
              __dirname,
              "../uploads",
              image
            );

          if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
        });

      }

    }
  );

  const sql = `
    UPDATE delivery_proofs
    SET
      tracking_id = ?,
      receiver_name = ?,
      status = ?,
      condition_status = ?,
      remarks = ?,
      proof_images = ?
    WHERE id = ?
  `;

  const values = [
    tracking_id,
    receiver_name,
    status,
    condition_status,
    remarks,
    proof_images,
    id
  ];

  db.query(
    sql,
    values,
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update delivery"
        });
      }

      res.status(200).json({
        message: "Delivery updated successfully"
      });

    }
  );
};

// DELETE DELIVERY
const deleteDelivery = (req, res) => {

  const { id } = req.params;

  db.query(
    "SELECT proof_images FROM delivery_proofs WHERE id = ?",
    [id],
    (err, results) => {

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

        images.forEach((image) => {
          const imagePath = path.join(
            __dirname,
            "../uploads",
            image
          );

          if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
        });

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
        total: results[0].total || 0,
        delivered: results[0].delivered || 0,
        damaged: results[0].damaged || 0
      };

      let insight;
      try {
        insight = await generateInsights(stats);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "AI generation failed"
        });
      }

      res.json({ insight });

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI generation failed"
    });
  }

};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  getStats,
  getAIInsights
};