import React from 'react';
import DayJS from 'dayjs';
import {ImagineWeb} from './ImagineWeb';
import { createRoot } from 'react-dom/client';
import RelativeTime from 'dayjs/plugin/relativeTime';

DayJS.extend(RelativeTime);

// @ts-ignore
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<ImagineWeb />);