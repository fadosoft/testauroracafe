
'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import CustomAlert from '@/components/CustomAlert';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      const data = await response.json();
      setError(data.message || 'Credenziali non valide.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Accesso Area Riservata</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nome Utente</label>
                  <input type="text" id="username" name="username" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" id="password" name="password" className="form-control" required />
                </div>
                {error && <CustomAlert message={error} type="danger" />}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Accedi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
