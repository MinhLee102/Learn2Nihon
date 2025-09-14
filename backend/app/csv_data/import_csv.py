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

def import_minna_vocabularies(current_dir: str, cur):
    with open(current_dir+'/vocabularies.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE vocabularies RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY vocabularies FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_readings(current_dir: str, cur):
    with open(current_dir+'/readings.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE readings RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY readings FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_questions(current_dir: str, cur):
    with open(current_dir+'/questions.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE questions RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY questions FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

def import_answers(current_dir: str, cur):
    with open(current_dir+'/answers.csv', "r", encoding="utf-8") as f:
        cur.execute("TRUNCATE TABLE answers RESTART IDENTITY CASCADE;")
        cur.copy_expert("COPY answers FROM STDIN WITH (FORMAT csv, HEADER true, ENCODING 'UTF8', NULL 'NULL')", f)

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

    import_minna_vocabularies(current_dir, cur)
    conn.commit()
    
    import_readings(current_dir, cur)
    conn.commit()

    import_questions(current_dir, cur)
    conn.commit()

    import_answers(current_dir, cur)
    conn.commit()

    cur.close()
    db.close()