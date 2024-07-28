export const formatTimeTrack = (duration: string) => {
  const newTime = Number(duration);
  const minutes = Math.floor(newTime / 1000 / 60);
  const seconds = Math.floor((newTime / 1000) % 60);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
};

export const formatPlayTime = (duration: number) => {
  const currentTimeInSeconds = Number(duration.toFixed(1)) * 1;
  const minutes = Math.floor(currentTimeInSeconds / 60);
  const seconds = Math.floor(currentTimeInSeconds % 60);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
};

export const formatDate = (createdAt: string) => {
  if (typeof createdAt !== "string") {
    return "Invalid Date";
  }

  const dateParts = createdAt.split("-");
  const createdAtDate = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );

  const todayDate = new Date();
  const timeDifference = todayDate.getTime() - createdAtDate.getTime();
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (dayDifference === 0) {
    return "Сегодня";
  } else if (dayDifference > 30) {
    const monthDifference = Math.floor(dayDifference / 30);
    return `${monthDifference} месяцев назад`;
  } else {
    return `${dayDifference} дней назад`;
  }
};
