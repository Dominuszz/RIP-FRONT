import type { FC } from 'react';
import { Container, ProgressBar, Spinner } from "react-bootstrap";

interface ModelLoaderProps {
  progress: number;
}

const ModelLoader: FC<ModelLoaderProps> = ({ progress }) => (
  <Container className="loading text-center p-4">
    <Spinner animation="border" variant="primary" className="mb-3" />
    <p className="mb-2">Загрузка модели ассистента...</p>
    <ProgressBar 
      now={progress * 100} 
      label={`${Math.round(progress * 100)}%`} 
      className="mb-3"
    />
  </Container>
);

export default ModelLoader;