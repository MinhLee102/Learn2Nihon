from app.database import get_db
import os

def import_kanji(current_dir: str, cur):
    with open(current_dir+'/kanji.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE kanji RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY kanji FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_mazii_vocabs(current_dir: str, cur):
    with open(current_dir+'/mazii_vocabs.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE mazii_vocabs RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY mazii_vocabs FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_meaning_detail(current_dir: str, cur):
    with open(current_dir+'/meaning_detail.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE meaning_detail RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY meaning_detail FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_examples(current_dir: str, cur):
    with open(current_dir+'/examples.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE examples RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY examples FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_data():
    db = next(get_db())
    conn = db.connection().connection  # lấy raw psycopg2 connection
    cur = conn.cursor()

    current_dir = os.path.dirname(os.path.abspath(__file__))

    import_kanji(current_dir, cur)
    conn.commit()

    import_mazii_vocabs(current_dir, cur)
    conn.commit()

    import_meaning_detail(current_dir, cur)
    conn.commit()

    import_examples(current_dir, cur)
    conn.commit()
    
    cur.close()
    db.close()