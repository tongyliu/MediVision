import psycopg2
import psycopg2.extras


def get_cursor(dict_cursor=False):
    """Return: conn, cursor pair to current database
    """
    conn = psycopg2.connect("dbname=medivision user=python password=python host=postgres")
    cur =  conn.cursor()
    if dict_cursor:
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    return conn, cur


def fin(conn, cur):
    """Terminate connection to current database
    """
    conn.commit()
    cur.close()
    conn.close()
