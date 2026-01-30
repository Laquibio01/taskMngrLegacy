import React, { useState } from 'react';
import { reportService } from '../../services/api';
import './ReportsTab.css';

const ReportsTab = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async (type) => {
    setLoading(true);
    try {
      let data;
      switch (type) {
        case 'tasks':
          data = await reportService.getTasksReport();
          break;
        case 'projects':
          data = await reportService.getProjectsReport();
          break;
        case 'users':
          data = await reportService.getUsersReport();
          break;
        default:
          return;
      }
      setReport(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await reportService.exportCSV();
      alert('Exportado a export_tasks.csv');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const formatReport = () => {
    if (!report) return '';

    if (report.type === 'tasks') {
      let text = '=== REPORTE: TAREAS ===\n\n';
      Object.keys(report.data).forEach(status => {
        text += `${status}: ${report.data[status]} tareas\n`;
      });
      text += `\nTotal: ${report.total}`;
      return text;
    } else if (report.type === 'projects') {
      let text = '=== REPORTE: PROYECTOS ===\n\n';
      report.data.forEach(item => {
        text += `${item.projectName}: ${item.taskCount} tareas\n`;
      });
      text += `\nTotal proyectos: ${report.total}`;
      return text;
    } else if (report.type === 'users') {
      let text = '=== REPORTE: USUARIOS ===\n\n';
      report.data.forEach(item => {
        text += `${item.username}: ${item.taskCount} tareas asignadas\n`;
      });
      text += `\nTotal usuarios: ${report.total}`;
      return text;
    }
    return '';
  };

  return (
    <div className="reports-tab">
      <h2>Generación de Reportes</h2>

      <div className="form-section">
        <div className="button-group">
          <button onClick={() => handleGenerateReport('tasks')} className="btn-primary">
            Reporte de Tareas
          </button>
          <button onClick={() => handleGenerateReport('projects')} className="btn-primary">
            Reporte de Proyectos
          </button>
          <button onClick={() => handleGenerateReport('users')} className="btn-primary">
            Reporte de Usuarios
          </button>
          <button onClick={handleExportCSV} className="btn-secondary">
            Exportar a CSV
          </button>
        </div>
      </div>

      <div className="reports-section">
        {loading ? (
          <div className="loading">Generando reporte...</div>
        ) : report ? (
          <pre className="report-content">{formatReport()}</pre>
        ) : (
          <div className="empty-state">Genera un reporte para ver los resultados</div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
