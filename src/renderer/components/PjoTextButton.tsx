import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function PjoTextButton({
  text,
  onClick,
  fontSize = undefined,
}: {
  text: string;
  fontSize?: number | undefined;
  onClick: () => void;
}) {
  return (
    <Button
      sx={{
        margin: `${fontSize ? fontSize / 4 : 0}vh 0`,
        width: '80%',
      }}
      variant="outlined"
      onClick={onClick}
    >
      <Typography
        sx={{
          fontSize: `${fontSize}vh`,
        }}
        variant="h3"
      >
        {text}
      </Typography>
    </Button>
  );
}
