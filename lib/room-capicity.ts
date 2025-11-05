export function getRoomCapacity(type: string) {
  const map: Record<string, number> = {
    "Single": 1,
    "1-Seater": 1,
    "2-Seater": 2,
    "3-Seater": 3,
    "4-Seater": 4,
    "5-Seater": 5,
    "6-Seater": 6,
  };

  return map[type] ?? null; // returns null if not found
}
