require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function initDb() {
  try {
    console.log("Connecting to the database to run schema migrations...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Creating `users` table if it doesn't exist...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Operations Staff', 'Warehouse Staff', 'Documentation Executive', 'Logistics Manager') NOT NULL DEFAULT 'Operations Staff',
        department VARCHAR(100),
        phone VARCHAR(20),
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Altering `delivery_proofs` to add audit fields...");
    
    const alterQueries = [
      "ALTER TABLE delivery_proofs ADD COLUMN created_by INT NULL",
      "ALTER TABLE delivery_proofs ADD COLUMN updated_by INT NULL",
      "ALTER TABLE delivery_proofs ADD COLUMN assigned_to INT NULL",
      "ALTER TABLE delivery_proofs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      "ALTER TABLE delivery_proofs ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL",
      "ALTER TABLE delivery_proofs ADD CONSTRAINT fk_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL",
      "ALTER TABLE delivery_proofs ADD CONSTRAINT fk_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL"
    ];

    for (const query of alterQueries) {
      try {
        await connection.query(query);
        console.log(`Successfully executed: ${query}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.log(`Column or Key already exists for query: ${query}`);
        } else {
          console.warn(`Warning on query: ${query} - ${err.message}`);
        }
      }
    }

    console.log("Seeding default Admin user...");
    const [existingAdmin] = await connection.query(`SELECT * FROM users WHERE email = 'admin@company.com'`);
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        `INSERT INTO users (name, email, password, role, department, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['System Admin', 'admin@company.com', hashedPassword, 'Admin', 'IT', 'Active']
      );
      console.log("Default admin created: admin@company.com / admin123");
    } else {
      console.log("Default admin already exists.");
    }

    console.log("Seeding default Ops user for testing...");
    const [existingOps] = await connection.query(`SELECT * FROM users WHERE email = 'ops@company.com'`);
    if (existingOps.length === 0) {
      const hashedPassword = await bcrypt.hash('ops123', 10);
      await connection.query(
        `INSERT INTO users (name, email, password, role, department, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['Operations Manager', 'ops@company.com', hashedPassword, 'Operations Staff', 'Operations', 'Active']
      );
      console.log("Default ops created: ops@company.com / ops123");
    }

    console.log("Seeding default Warehouse user for testing...");
    const [existingWh] = await connection.query(`SELECT * FROM users WHERE email = 'warehouse@company.com'`);
    if (existingWh.length === 0) {
      const hashedPassword = await bcrypt.hash('warehouse123', 10);
      await connection.query(
        `INSERT INTO users (name, email, password, role, department, status) VALUES (?, ?, ?, ?, ?, ?)`,
        ['Warehouse Staff', 'warehouse@company.com', hashedPassword, 'Warehouse Staff', 'Warehouse', 'Active']
      );
      console.log("Default warehouse created: warehouse@company.com / warehouse123");
    }

    await connection.end();
    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

initDb();
