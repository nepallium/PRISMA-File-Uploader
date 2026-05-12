import pool from "./pool.js";

export async function createUser(formData) {
  const { rows } = await pool.query(
    `
        INSERT INTO users (email, password, first_name, last_name)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
    [
      formData.email,
      formData.password,
      formData.first_name,
      formData.last_name,
    ],
  );

  return rows[0];
}

export async function isEmailAvailable(value) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    value,
  ]);
  if (rows.length !== 0) {
    throw Error;
  }
}

// === MESSAGES
export async function createMessage(formData) {
  await pool.query(
    `
        INSERT INTO messages (author_id, title, content)
        VALUES ($1, $2, $3)
        `,
    [formData.author_id, formData.title, formData.content],
  );
}

export async function getAllMessages() {
  const { rows } = await pool.query(`
        SELECT 
            m.message_id, m.title, m.content, m.created_at,
            CONCAT_WS(' ', u.first_name, u.last_name) AS author_name
        FROM messages m
        JOIN users u ON author_id = user_id
        ORDER BY m.created_at DESC
    `);
  return rows;
}

export async function deleteMessage(id) {
  await pool.query(`DELETE FROM messages WHERE message_id = $1`, [id]);
}

// === MEMBER
export async function changeMemberStatusPositive(user_id) {
  await pool.query(
    `
        UPDATE users
        SET is_member = TRUE
        WHERE user_id = $1
        `,
    [user_id],
  );
}
