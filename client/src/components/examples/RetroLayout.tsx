import RetroLayout from "../RetroLayout";

export default function RetroLayoutExample() {
  return (
    <RetroLayout backgroundPattern="stars">
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Retro Layout with Custom Cursor!</h1>
        <p className="text-lg">Move your mouse to see the otter cursor 🦦</p>
      </div>
    </RetroLayout>
  );
}
