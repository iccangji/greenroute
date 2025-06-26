export async function fetchExample() {
    const res = await fetch('/api/example')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
}