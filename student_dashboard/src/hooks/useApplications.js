import { useState, useEffect } from 'react';
import {
  fetchApplications,
  createApplication,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
} from '../services/api';

export const useApplications = () => {
  const [applications, setApplications] = useState({
    applied: [],
    shortlisted: [],
    interviews: [],
    offers: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchApplications();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load applications');
        setLoading(false);
      }
    };
    load();
  }, []);

  const addApplication = async (applicationData) => {
    const result = await createApplication(applicationData);
    const updated = await fetchApplications();
    setApplications(updated);
    return result;
  };

  const moveApplication = async (id, fromStatus, toStatus) => {
    await updateApplicationStatus(id, toStatus);
    const updatedApplications = { ...applications };
    const index = updatedApplications[fromStatus].findIndex((a) => a.id === id);
    if (index !== -1) {
      const app = updatedApplications[fromStatus][index];
      updatedApplications[fromStatus] = updatedApplications[fromStatus].filter((a) => a.id !== id);
      updatedApplications[toStatus] = [...updatedApplications[toStatus], app];
      setApplications(updatedApplications);
    }
  };

  const editApplication = async (id, updatedData) => {
    await updateApplication(id, updatedData);
    const updated = await fetchApplications();
    setApplications(updated);
  };

  const removeApplication = async (id, status) => {
    await deleteApplication(id);
    const updated = { ...applications };
    updated[status] = updated[status].filter((a) => a.id !== id);
    setApplications(updated);
  };

  return {
    applications,
    loading,
    error,
    addApplication,
    moveApplication,
    editApplication,
    removeApplication,
  };
};
