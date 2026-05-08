import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root')!;

// 清除加载动画，显示 React 应用
rootElement.innerHTML = '';
ReactDOM.createRoot(rootElement).render(<App />);
