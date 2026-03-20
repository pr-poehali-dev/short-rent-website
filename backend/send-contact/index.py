import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с формы контактов на почту владельца сайта."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    contact = body.get('contact', '').strip()
    message = body.get('message', '').strip()

    if not name or not contact or not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': {'error': 'Заполните все поля'}
        }

    smtp_email = os.environ['SMTP_EMAIL']
    smtp_password = os.environ['SMTP_PASSWORD']

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта НОЧЕВКА от {name}'
    msg['From'] = smtp_email
    msg['To'] = smtp_email

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 12px;">
        <h2 style="color: #7B2FFF; margin-bottom: 24px;">📩 Новое сообщение с сайта НОЧЕВКА</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #888; width: 120px;">Имя</td>
                <td style="padding: 12px 0; font-weight: bold; color: #222;">{name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #888;">Контакт</td>
                <td style="padding: 12px 0; font-weight: bold; color: #222;">{contact}</td>
            </tr>
            <tr>
                <td style="padding: 12px 0; color: #888; vertical-align: top;">Сообщение</td>
                <td style="padding: 12px 0; color: #222; line-height: 1.6;">{message}</td>
            </tr>
        </table>
        <p style="margin-top: 24px; color: #aaa; font-size: 12px;">Письмо отправлено автоматически с формы сайта nocheVka.ru</p>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, smtp_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Сообщение отправлено!'})
    }