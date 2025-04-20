import { root } from '@lynx-js/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Transfer } from './presentation/features/transfer/transfer.jsx';
import { Receipt } from './presentation/features/receipt/receipt.jsx';
import './styles.css';
import { Login } from './presentation/features/auth/login.tsx';

root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/receipt" element={<Receipt />} />
    </Routes>
  </MemoryRouter>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
