export async function fetchEvents() {
    const response = await fetch('http://localhost:3000/events');
    if (!response.ok) {
        throw new Error('Erreur réseau')
    }
    return response.json();
}
