import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds']
credentials = ServiceAccountCredentials.from_json_keyfile_name('client_secret.json' , scope)
client = gspread.authorize(credentials)

sheet = client.open('Expenses file').sheet1
expenses = sheet.get_all_records()
print(expenses)
