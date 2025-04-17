// Helper function to get status badge variant
export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published':
      return 'success';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'destructive';
    default:
      return 'default';
  }
};
