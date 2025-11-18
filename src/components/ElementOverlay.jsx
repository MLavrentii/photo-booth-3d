import { Rnd } from "react-rnd";

export default function ElementOverlay({
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
        e.stopPropagation();       // prevent deselect
        onSelect();
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
        zIndex: isSelected ? 25 : 10,
        border: isSelected ? "1px dashed rgba(200,200,200,0.7)" : "none",
        cursor: "move",
        position: "absolute",
      }}
    >
      {/* Delete button inside by 5% */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent select on delete
            onDelete();
          }}
          style={{
            position: "absolute",

            // inside the element
            top: "5%",
            right: "5%",
            transform: "translate(50%, -50%)",

            width: 28,
            height: 28,
            background: "rgba(255, 0, 0, 0.9)",
            border: "none",
            borderRadius: "50%",
            color: "white",
            cursor: "pointer",
            zIndex: 999,
            fontSize: 16,
            textAlign: "center",
            lineHeight: "28px",
          }}
        >
          ✕
        </button>
      )}
    </Rnd>
  );
}
