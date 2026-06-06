from datetime import date, timedelta

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_sites_returns_empty_list(client: AsyncClient):
    response = await client.get("/api/v1/sites/")
    assert response.status_code == 200
    assert response.json() == []
    assert response.headers["Cache-Control"] == "public, max-age=3600, stale-while-revalidate=600"


@pytest.mark.asyncio
async def test_list_sites_returns_seeded_sites(seeded_client: AsyncClient):
    response = await seeded_client.get("/api/v1/sites/")
    assert response.status_code == 200
    names = [site["name"] for site in response.json()]
    assert names == ["Other Cove", "Test Beach"]


@pytest.mark.asyncio
async def test_get_site_returns_detail(seeded_client: AsyncClient):
    response = await seeded_client.get("/api/v1/sites/1")
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Test Beach"
    assert body["latitude"] == 27.95


@pytest.mark.asyncio
async def test_get_site_returns_404_when_missing(client: AsyncClient):
    response = await client.get("/api/v1/sites/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Site not found"


@pytest.mark.asyncio
async def test_get_site_samples_returns_ordered_samples(seeded_client: AsyncClient):
    response = await seeded_client.get("/api/v1/sites/1/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) == 2
    assert samples[0]["sample_date"] == "2024-02-01"
    assert samples[0]["quality_code"] == "poor"
    assert samples[1]["sample_date"] == "2024-01-10"


@pytest.mark.asyncio
async def test_get_site_samples_filters_by_quality_code(seeded_client: AsyncClient):
    response = await seeded_client.get(
        "/api/v1/sites/1/samples",
        params={"quality_code": "good"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["quality_code"] == "good"


@pytest.mark.asyncio
async def test_get_site_samples_returns_404_for_unknown_site(client: AsyncClient):
    response = await client.get("/api/v1/sites/42/samples")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_dashboard_returns_samples_and_weather(seeded_client: AsyncClient):
    response = await seeded_client.get(
        "/api/v1/dashboard/sites/samples",
        params={
            "start_date": "2024-01-01",
            "end_date": "2024-02-28",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["sample_sites"]["total"] == 3
    assert len(body["weather_records"]) == 2


@pytest.mark.asyncio
async def test_dashboard_for_single_site(seeded_client: AsyncClient):
    response = await seeded_client.get(
        "/api/v1/dashboard/sites/1/samples",
        params={
            "start_date": "2024-01-01",
            "end_date": "2024-02-28",
        },
    )
    assert response.status_code == 200
    assert response.json()["sample_sites"]["total"] == 2


@pytest.mark.asyncio
async def test_dashboard_returns_404_for_unknown_site(client: AsyncClient):
    response = await client.get(
        "/api/v1/dashboard/sites/99/samples",
        params={
            "start_date": "2024-01-01",
            "end_date": "2024-02-28",
        },
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_dashboard_rejects_date_range_over_limit(seeded_client: AsyncClient):
    start = date(2023, 1, 1)
    end = start + timedelta(days=365)
    response = await seeded_client.get(
        "/api/v1/dashboard/sites/samples",
        params={
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
        },
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_weather_records_support_date_filters(seeded_client: AsyncClient):
    response = await seeded_client.get(
        "/api/v1/weather/",
        params={
            "start_date": "2024-02-01",
            "end_date": "2024-02-28",
        },
    )
    assert response.status_code == 200
    records = response.json()
    assert len(records) == 1
    assert records[0]["weather_date"] == "2024-02-01"
