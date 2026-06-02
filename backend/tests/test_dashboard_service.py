from datetime import date, timedelta
from unittest.mock import patch

import pytest
from fastapi import HTTPException

from app.services.dashboard_service import (
    MAX_DATE_RANGE_DAYS,
    _resolve_date_range,
    _validate_date_range,
)


class TestResolveDateRange:
    def test_uses_explicit_start_and_end(self):
        start, end = _resolve_date_range(date(2024, 1, 1), date(2024, 1, 31))
        assert start == date(2024, 1, 1)
        assert end == date(2024, 1, 31)

    def test_defaults_end_to_today_when_missing(self):
        fixed_today = date(2024, 6, 15)
        with patch("app.services.dashboard_service.date") as mock_date:
            mock_date.today.return_value = fixed_today
            mock_date.side_effect = date
            start, end = _resolve_date_range(date(2024, 5, 1), None)

        assert end == fixed_today
        assert start == date(2024, 5, 1)

    def test_defaults_to_thirty_day_window_when_both_missing(self):
        fixed_today = date(2024, 6, 15)
        with patch("app.services.dashboard_service.date") as mock_date:
            mock_date.today.return_value = fixed_today
            mock_date.side_effect = date
            start, end = _resolve_date_range(None, None)

        assert end == fixed_today
        assert start == fixed_today - timedelta(days=30)


class TestValidateDateRange:
    def test_allows_range_at_max_days(self):
        start = date(2024, 1, 1)
        end = start + timedelta(days=MAX_DATE_RANGE_DAYS)
        _validate_date_range(start, end)

    def test_rejects_range_over_max_days(self):
        start = date(2024, 1, 1)
        end = start + timedelta(days=MAX_DATE_RANGE_DAYS + 1)
        with pytest.raises(HTTPException) as exc_info:
            _validate_date_range(start, end)

        assert exc_info.value.status_code == 400
        assert str(MAX_DATE_RANGE_DAYS) in exc_info.value.detail
