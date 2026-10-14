import React, { useState, useEffect } from 'react';
import { Play, Clock, Eye, User, Sparkles, Filter, X, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { VideoLecture } from '../types';

export const Videos: React.FC = () => {
  const [videos, setVideos] = useState<VideoLecture[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos(selectedSubject);
  }, [selectedSubject]);

  const fetchVideos = async (subject: string) => {
    try {
      setLoading(true);
      const res = await api.getVideos(subject);
      setVideos(res.data);
      if (!activeVideo && res.data.length > 0) {
        setActiveVideo(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const subjects = ['All', 'Machine Learning', 'Deep Learning & CV', 'Generative AI & LLMs', 'Python & Data Science', 'No-Code AI'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>AI Video Masterclasses &amp; Labs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
            High-definition recorded lectures, practical PyTorch coding walkthroughs, and GenAI system builds
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              style={{
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                background: selectedSubject === sub ? 'var(--grad-brand)' : 'var(--bg-glass)',
                color: selectedSubject === sub ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedSubject === sub ? 'transparent' : 'var(--border-glass)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Video Player Screen */}
      {activeVideo && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#000',
              aspectRatio: '16 / 9',
              maxHeight: '480px',
              width: '100%',
              marginBottom: '18px',
            }}
          >
            <video
              src={activeVideo.videoUrl}
              controls
              poster={activeVideo.thumbnail}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--primary-light)',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {activeVideo.subject}
                </span>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Published on {activeVideo.date}
                </span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>{activeVideo.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '800px', lineHeight: 1.6 }}>
                {activeVideo.description}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--grad-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {activeVideo.teacher.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{activeVideo.teacher}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Senior Faculty Instructor</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Play size={44} style={{ color: 'var(--primary-light)', margin: '0 auto 16px', opacity: 0.7 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
            No Video Masterclasses Published (0)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '480px', margin: '0 auto' }}>
            All static seed video data has been cleared. When faculty upload video lessons from the Admin Control Center, they will stream here live.
          </p>
        </div>
      ) : (
        <>
          {/* Video Lecture Catalog Grid */}
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Available Course Lectures</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {videos.map((vid) => {
          const isCurrent = activeVideo?._id === vid._id;
          return (
            <div
              key={vid._id}
              className="glass-card glass-card-interactive"
              onClick={() => setActiveVideo(vid)}
              style={{
                cursor: 'pointer',
                borderColor: isCurrent ? 'var(--primary)' : undefined,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#1e293b' }}>
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.8)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={11} />
                  <span>{vid.duration}</span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                  }}
                >
                  <Play size={20} style={{ marginLeft: '3px' }} />
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                    {vid.subject}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} /> {vid.views} views
                  </span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {vid.title}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Instructor: <strong>{vid.teacher}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
};
