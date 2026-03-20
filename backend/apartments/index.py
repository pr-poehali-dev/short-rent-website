import json
import os
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """API для получения и управления объявлениями об аренде квартир."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}

    # GET — список активных квартир
    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, title, location, price, rooms, area, floor,
                   description, tags, img_url, badge, rating, reviews
            FROM apartments
            WHERE active = TRUE
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        apartments = []
        for row in rows:
            apartments.append({
                'id': row[0],
                'title': row[1],
                'location': row[2],
                'price': row[3],
                'rooms': row[4],
                'area': row[5],
                'floor': row[6],
                'description': row[7],
                'tags': row[8] or [],
                'img_url': row[9] or '',
                'badge': row[10] or '',
                'rating': float(row[11]) if row[11] else 5.0,
                'reviews': row[12] or 0,
            })

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'apartments': apartments}, ensure_ascii=False)
        }

    # POST — добавить квартиру (только для админа)
    if method == 'POST':
        admin_key = headers.get('X-Admin-Key') or headers.get('x-admin-key', '')
        if admin_key != os.environ.get('ADMIN_KEY', ''):
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Нет доступа'})
            }

        body = json.loads(event.get('body') or '{}')
        title = body.get('title', '').strip()
        price = body.get('price', 0)

        if not title or not price:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Укажите название и цену'})
            }

        tags = body.get('tags', [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(',') if t.strip()]

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO apartments (title, location, price, rooms, area, floor, description, tags, img_url, badge)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            title,
            body.get('location', 'Ачинск'),
            int(price),
            body.get('rooms', ''),
            body.get('area') or None,
            body.get('floor', ''),
            body.get('description', ''),
            tags,
            body.get('img_url', ''),
            body.get('badge', ''),
        ))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'id': new_id})
        }

    # DELETE — удалить (деактивировать) квартиру
    if method == 'DELETE':
        admin_key = headers.get('X-Admin-Key') or headers.get('x-admin-key', '')
        if admin_key != os.environ.get('ADMIN_KEY', ''):
            return {
                'statusCode': 403,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Нет доступа'})
            }

        body = json.loads(event.get('body') or '{}')
        apt_id = body.get('id')

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE apartments SET active = FALSE WHERE id = %s", (apt_id,))
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True})
        }

    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
