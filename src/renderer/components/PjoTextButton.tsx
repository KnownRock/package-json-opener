import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function PjoTextButton({
  text,
  onClick,
  fontSize = undefined,
  height = undefined,
  margin = undefined,
}: {
  text: string;
  fontSize?: string | undefined;
  margin?: string | undefined;
  height?: string | undefined;
  onClick: () => void;
}) {
  return (
    <Button
      sx={{
        // margin: `${fontSize ? fontSize / 4 : 0}vh 0`,
        width: '80%',
        display: 'flex',
        alignItems: 'center',

        margin,
        height,
      }}
      variant="outlined"
      onClick={onClick}
    >
      <Typography
        sx={{
          fontSize,
        }}
        variant="h3"
      >
        {text}
      </Typography>
    </Button>
  );
}
