import { Rnd } from "react-rnd";

export default function FrameOverlay({
  item,
  isSelected,
  onSelect,
  onDelete,
  onChange,
}) {
  return (
    <Rnd
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      bounds="parent"
      lockAspectRatio={false}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      onClick={(e) => {
        e.stopPropagation();    // prevents deselection
        onSelect();             // select this item
      }}
      onDragStart={(e) => e.stopPropagation()}
      onResizeStart={(e) => e.stopPropagation()}
      onDragStop={(e, d) =>
        onChange({ ...item, x: d.x, y: d.y })
      }
      onResizeStop={(e, direction, ref, delta, pos) =>
        onChange({
          ...item,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: pos.x,
          y: pos.y,
        })
      }
      style={{
        backgroundImage: `url(${item.src})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        cursor: "move",
        zIndex: isSelected ? 25 : 10,
        border: isSelected ? "1px dashed rgba(200,200,200,0.7)" : "none",
        position: "absolute",
      }}
    >
      {/* ---------------------- DELETE BUTTON ---------------------- */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevents selecting while pressing X
            onDelete();
          }}
          style={{
            position: "absolute",

            // 5% INSIDE the element
            top: "5%",
            right: "5%",

            transform: "translate(50%, -50%)",

            width: 28,
            height: 28,
            background: "rgba(255, 0, 0, 0.9)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 999,
            fontSize: 16,
            lineHeight: "28px",
            textAlign: "center",
          }}
        >
          ✕
        </button>
      )}
    </Rnd>
  );
}
