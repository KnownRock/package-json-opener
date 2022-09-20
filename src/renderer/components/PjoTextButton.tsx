import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function PjoTextButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <Button
      sx={{
        margin: 1,
        width: '80%',
      }}
      variant="outlined"
      onClick={onClick}
    >
      <Typography variant="h3">{text}</Typography>
    </Button>
  );
}
