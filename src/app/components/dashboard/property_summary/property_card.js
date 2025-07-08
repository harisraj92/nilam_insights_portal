export default function PropertyCard({ data }) {
    console.log("📦 PropertyCard received data:", data);
    if (!data || !data.name) {
        console.warn("🚫 Invalid property data:", data);
        return <div className="text-red-600 p-4">Invalid property data</div>;
    }
    const { name } = data;

    return (
        <div className="border border-blue-300 p-4 rounded-md">
            <h3 className="text-lg font-bold text-gray-700">Property Name: {name}</h3>
        </div>
    );
}
