import pandas as pd


def _parse_coordinate(value: object) -> float:
    if isinstance(value, str):
        value = value.strip()
    return float(value)


def get_sheet_data(url: str):
    sheet = pd.read_csv(url)

    sheet.columns = sheet.columns.str.strip().str.lower().str.replace(" ", "_")
    # Strip non breaking spaces and whitespaces from all string columns
    sheet = pd.DataFrame(sheet.apply(lambda col: col.map(lambda x: str(x).replace("\xa0", "").strip() if isinstance(x, str) else x)))

    return parse_rows(sheet)



def parse_rows(sheet: pd.DataFrame):
    results = []

    for _, row in sheet.iterrows():
        results.append(
            {
                "name": row["sample_site"],
                "latitude": _parse_coordinate(row["latitude"]),
                "longitude": _parse_coordinate(row["longitude"]),
                "sample_date": pd.Timestamp(str(row["date"])).date(),
                "enterococci_per_100ml": row["enterococci_per_100ml"],
                "quality_code": row["enterococcus_code"],
            }
        )

    return results