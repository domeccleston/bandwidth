export function formatted(bytes: number) {
  const num = bytes.toLocaleString();

  if (num.length < 4) {
    return num + ' bytes';
  } else if (num.length > 4 && num.length < 8) {
    return (bytes / 1000).toLocaleString() + ' Kb';
  } else if (num.length > 8 && num.length < 12) {
    return (bytes / 1000000).toLocaleString() + ' Mb';
  } else if (num.length > 12 && num.length < 16) {
    return (bytes / 1000000000).toLocaleString() + ' Gb';
  } else if (num.length > 16) {
    return (bytes / 1000000000000).toLocaleString() + ' Tb';
  };
}
