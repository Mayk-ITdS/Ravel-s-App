import {
  CardMedia,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  CartItem,
  removeFromCart,
  updateQuantity,
} from "../../Store/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";

const CartItemsList: React.FC<{ item: CartItem }> = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <ListItem
      key={item.id}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, borderRadius: "8px", mr: 2 }}
        image={item.image}
      />
      <ListItemText
        primary={
          <Typography variant="h6" fontWeight="bold">
            {item.name}
          </Typography>
        }
        secondary={`${item.price} zł`}
      />
      <Select
        value={item.quantity}
        onChange={(e) =>
          dispatch(
            updateQuantity({
              id: item.id,
              type: "product",
              quantity: Number(e.target.value),
            })
          )
        }
        sx={{ width: 70, mr: 2 }}
      >
        {[1, 2, 3, 4, 5].map((q) => (
          <MenuItem key={q} value={q}>
            {q}
          </MenuItem>
        ))}
      </Select>
      <IconButton
        onClick={() =>
          dispatch(
            removeFromCart({
              id: item.id,
              type: "product",
            })
          )
        }
        sx={{ color: "red" }}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};
export default CartItemsList;
