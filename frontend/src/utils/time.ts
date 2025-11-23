import dayjs from './dayjs';

export const formatTime = (iso: string) => dayjs(iso).format('YYYY-MM-DD HH:mm');
export const fromNow = (iso: string) => dayjs(iso).fromNow();
