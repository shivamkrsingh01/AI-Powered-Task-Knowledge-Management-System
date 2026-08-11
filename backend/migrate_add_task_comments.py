"""
Migration script to create task_comments table
"""
from sqlalchemy import text
from app.core.database import engine

def migrate():
    try:
        with engine.connect() as conn:
            # Create task_comments table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS task_comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    task_id INT NOT NULL,
                    user_id INT NOT NULL,
                    content TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (task_id) REFERENCES tasks(id),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """))
            conn.commit()
            print("Created task_comments table")
            print("\nMigration completed successfully!")
            
    except Exception as e:
        print(f"Migration failed: {e}")
        raise

if __name__ == "__main__":
    migrate()
