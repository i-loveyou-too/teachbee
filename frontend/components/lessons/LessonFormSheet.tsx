'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { createLesson, updateLesson, getStudents } from '@/lib/api';
import type { Lesson, Student } from '@/lib/types';

interface LessonFormSheetProps {
  open: boolean;
  onClose: () => void;
  lesson?: Lesson | null; // null이면 create mode, 있으면 edit mode
  onSuccess?: () => void; // 저장 성공 후 호출
}

export default function LessonFormSheet({ open, onClose, lesson, onSuccess }: LessonFormSheetProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [student, setStudent] = useState<number | null>(null);
  const [lessonDate, setLessonDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [method, setMethod] = useState<'offline' | 'online'>('offline');
  const [status, setStatus] = useState<'예정' | '완료' | '결석' | '보강'>('예정');
  const [memo, setMemo] = useState('');

  // 학생 목록 로드
  useEffect(() => {
    if (open) {
      getStudents()
        .then(setStudents)
        .catch(() => setStudents([]));
    }
  }, [open]);

  // Edit mode일 때 폼에 값 채우기
  useEffect(() => {
    if (open && lesson) {
      setStudent(lesson.student);
      setLessonDate(lesson.lesson_date);
      setStartTime(lesson.start_time);
      setEndTime(lesson.end_time || '');
      setSubject(lesson.subject);
      setLocation(lesson.location);
      setMethod(lesson.method === '대면' ? 'offline' : 'online');
      setStatus(lesson.status);
      setMemo(lesson.memo || '');
    } else if (open) {
      // Create mode 초기화
      setStudent(null);
      setLessonDate('');
      setStartTime('');
      setEndTime('');
      setSubject('');
      setLocation('');
      setMethod('offline');
      setStatus('예정');
      setMemo('');
    }
    setError(null);
  }, [open, lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !lessonDate || !startTime || !endTime || !subject) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        student,
        lesson_date: lessonDate,
        start_time: startTime,
        end_time: endTime || null,
        subject,
        location,
        method,
        status,
        memo,
        homework: '',
        homework_checked: false,
        prep_done: false,
      };

      if (lesson) {
        // Edit mode
        await updateLesson(lesson.id, payload as any);
      } else {
        // Create mode
        await createLesson(payload as any);
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Failed to save lesson:', err);
      setError(err.message || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!lesson;
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 44,
    borderRadius: 12,
    padding: '10px 12px',
    border: '1px solid #eee',
    background: '#f7f8fa',
    fontSize: 13,
    lineHeight: 1.4,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#888',
    display: 'block',
    marginBottom: 4,
    lineHeight: 1.35,
    fontFamily: 'inherit',
  };
  const actionButtonStyle: React.CSSProperties = {
    minHeight: 46,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? '수업 수정' : '수업 추가'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error && (
          <div style={{ padding: 10, borderRadius: 10, background: '#ffeaea', color: '#d94a4a', fontSize: 12, fontWeight: 500 }}>
            {error}
          </div>
        )}

        {/* Student */}
        <div>
          <label style={labelStyle}>학생 *</label>
          <select
            value={student || ''}
            onChange={(e) => setStudent(Number(e.target.value) || null)}
            required
            style={fieldStyle}
          >
            <option value="">선택</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label style={labelStyle}>날짜 *</label>
          <input
            type="date"
            value={lessonDate}
            onChange={(e) => setLessonDate(e.target.value)}
            required
            style={fieldStyle}
          />
        </div>

        {/* Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>시작 시간 *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              style={fieldStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>종료 시간</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={fieldStyle}
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label style={labelStyle}>과목 *</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="영어, 수학, 국어 등"
            required
            style={fieldStyle}
          />
        </div>

        {/* Location */}
        <div>
          <label style={labelStyle}>장소</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="강남 카페, 온라인 등"
            style={fieldStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={labelStyle}>수업 방식</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'offline' | 'online')}
              style={fieldStyle}
            >
              <option value="offline">대면</option>
              <option value="online">온라인</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as '예정' | '완료' | '결석' | '보강')}
              style={fieldStyle}
            >
              <option value="예정">예정</option>
              <option value="완료">완료</option>
              <option value="결석">결석</option>
              <option value="보강">보강</option>
            </select>
          </div>
        </div>

        {/* Memo */}
        <div>
          <label style={labelStyle}>메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="특이사항을 메모하세요"
            style={{ ...fieldStyle, minHeight: 68, resize: 'none' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginTop: 2 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...actionButtonStyle,
              background: loading ? '#ccc' : '#8FDCCF',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '저장 중...' : isEdit ? '수정 완료' : '추가하기'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...actionButtonStyle,
              background: '#f7f8fa',
              color: '#888',
            }}
          >
            취소
          </button>
        </div>
      </form>
    </Modal>
  );
}
