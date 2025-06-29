import { useRefreshStore } from '../stores/refreshStore';

type AddNoteButtonProps = {
  text?: string;
  onClick?: () => void;
};

const AddNoteButton = ({ text = '+', onClick }: AddNoteButtonProps) => {
  if (!onClick) {
    onClick = () => {
      const E = window.electron;
      E.db.createNote().then((id) => {
        console.log('New note created with ID:', id);
        useRefreshStore.getState().triggerRefresh();
      });
    };
  }
  return (
    <button className="w-full h-full" onClick={onClick}>
      {text}
    </button>
  );
};

export default AddNoteButton;
