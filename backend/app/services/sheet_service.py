import pandas as pd


def get_sheet_data(url: str):
    sheet = pd.read_excel(url)

    sheet.columns = sheet.columns.str.strip().str.lower().str.replace(" ", "_")

    return parse_rows(sheet)



def parse_rows(sheet: pd.DataFrame):
    results = []

    for _, row in sheet.iterrows():
        results.append(
            {
                "name": row["sample_site"],
                "latitude": row["latitude"],
                "longitude": row["longitude"],
                "sample_date": row["date"],
                "enterococci_per_100ml": row["enterococci_per_100ml"],
                "quality_code": row["enterococcus_code"],
            }
        )

    return results