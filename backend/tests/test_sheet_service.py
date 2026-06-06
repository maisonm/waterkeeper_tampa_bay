import pandas as pd

from app.services.sheet_service import parse_rows


def _sample_sheet(*, latitude: object, longitude: object) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "sample_site": "Cockroach Bay Boat Ramp",
                "latitude": latitude,
                "longitude": longitude,
                "date": "2024-01-15",
                "enterococci_per_100ml": 10,
                "enterococcus_code": "good",
            }
        ]
    )


class TestParseRows:
    def test_parses_string_coordinates_as_floats(self):
        rows = parse_rows(_sample_sheet(latitude="27.687071", longitude="-82.520604"))

        assert rows[0]["latitude"] == 27.687071
        assert rows[0]["longitude"] == -82.520604
        assert isinstance(rows[0]["latitude"], float)
        assert isinstance(rows[0]["longitude"], float)

    def test_preserves_numeric_coordinates(self):
        rows = parse_rows(_sample_sheet(latitude=27.687071, longitude=-82.520604))

        assert rows[0]["latitude"] == 27.687071
        assert rows[0]["longitude"] == -82.520604
