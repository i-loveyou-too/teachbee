'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import AppHeader from '@/components/layout/AppHeader';
import Modal from '@/components/common/Modal';
import { getCancelMakeups, getLessons, getStudents } from '@/lib/api';
import { PAYMENT_BADGE } from '@/lib/constants';
import type { CancelMakeup, Lesson, PaymentStatus, Student, StudentFormData } from '@/lib/types';

// ── Mock 데이터 ───────────────────────────────────────────────────────────

// ── 학생 상세 모달 (원본 그대로) ──────────────────────────────────────────
function StudentDetailModal({
  student,
  lessons,
  cancels,
  onClose,
  onEdit,
  onDelete,
}: {
  student: Student;
  lessons: Lesson[];
  cancels: CancelMakeup[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
}) {
  const studentLessons = lessons.filter(l => l.student === student.id);
  const studentCancels = cancels.filter(c => c.student === student.id);
  const pay = PAYMENT_BADGE[student.payment_status] ?? PAYMENT_BADGE['대기'];

  const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    완료: { bg: '#e8faf0', color: '#2ba862' },
    결강: { bg: '#ffeaea', color: '#d94a4a' },
    보강: { bg: '#e8f4fd', color: '#3a8fd4' },
    예정: { bg: '#f0f0f0', color: '#888' },
  };

  return (
    <Modal open onClose={onClose}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EEF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#8FDCCF', flexShrink: 0 }}>
          {student.name[0]}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{student.name}</div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {student.subject}
            {student.regular_day ? ` · ${student.regular_day}` : ''}
            {student.regular_time ? ` ${student.regular_time}` : ''}
          </div>
        </div>
      </div>

      {/* 수업료/입금 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div style={{ background: '#f7f8fa', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#888' }}>수업료</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{student.fee.toLocaleString()}원</div>
        </div>
        <div style={{ background: '#f7f8fa', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#888' }}>입금</div>
          <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: pay.bg, color: pay.text }}>
            {student.payment_status}
          </span>
        </div>
      </div>

      {student.phone && <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>📞 {student.phone}</div>}
      {student.default_location && <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>📍 {student.default_location}</div>}
      {student.memo && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>📝 {student.memo}</div>}

      {/* 최근 수업 */}
      <div style={{ fontSize: 13, fontWeight: 600, margin: '12px 0 8px' }}>최근 수업</div>
      {studentLessons.length === 0 ? (
        <div style={{ fontSize: 12, color: '#888' }}>수업 기록이 없어요</div>
      ) : (
        studentLessons.slice(0, 5).map(l => {
          const s = STATUS_STYLE[l.status] ?? STATUS_STYLE['예정'];
          return (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f8fa', borderRadius: 8, padding: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>{l.lesson_date} {l.start_time}</span>
              <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: s.bg, color: s.color }}>{l.status}</span>
            </div>
          );
        })
      )}

      {/* 결강/보강 */}
      {studentCancels.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, margin: '12px 0 8px' }}>결강/보강</div>
          {studentCancels.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f8fa', borderRadius: 8, padding: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>결강: {c.cancel_date}</span>
              <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: c.makeup_done ? '#e8faf0' : '#fff8e1', color: c.makeup_done ? '#2ba862' : '#c49000' }}>
                {c.makeup_done ? '보강완료' : '보강필요'}
              </span>
            </div>
          ))}
        </>
      )}

      {/* 액션 */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={onEdit} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: '#8FDCCF', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>수정</button>
        <button onClick={() => { onDelete(student.id); onClose(); }} style={{ padding: '10px 16px', borderRadius: 12, background: '#ffeaea', color: '#d94a4a', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer' }}>삭제</button>
      </div>
      <button onClick={onClose} style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>닫기</button>
    </Modal>
  );
}

// ── 학생 폼 모달 ───────────────────────────────────────────────────────────
function StudentFormModal({
  student,
  onClose,
  onSave,
}: {
  student: Student | null;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%', borderRadius: 12, padding: 12, marginBottom: 12,
    border: '1px solid #eee', background: '#f7f8fa', fontSize: 13, outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: '#888', display: 'block', marginBottom: 4 };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      subject: fd.get('subject') as string,
      regular_day: fd.get('regular_day') as string,
      regular_time: fd.get('regular_time') as string,
      default_location: fd.get('default_location') as string,
      lesson_method: fd.get('lesson_method') as Student['lesson_method'],
      fee: Number(fd.get('fee')) || 0,
      payment_status: (fd.get('payment_status') as PaymentStatus) ?? '대기',
      memo: fd.get('memo') as string,
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={student ? '학생 수정' : '학생 추가'}>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>이름 *</label>
        <input name="name" required defaultValue={student?.name ?? ''} style={inputStyle} />

        <label style={labelStyle}>연락처</label>
        <input name="phone" defaultValue={student?.phone ?? ''} style={inputStyle} />

        <label style={labelStyle}>과목</label>
        <input name="subject" defaultValue={student?.subject ?? ''} style={inputStyle} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>수업 요일</label>
            <input name="regular_day" defaultValue={student?.regular_day ?? ''} placeholder="월, 수" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>수업 시간</label>
            <input name="regular_time" type="time" defaultValue={student?.regular_time ?? ''} style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>장소</label>
        <input name="default_location" defaultValue={student?.default_location ?? ''} style={inputStyle} />

        <label style={labelStyle}>수업 방식</label>
        <select name="lesson_method" defaultValue={student?.lesson_method ?? '대면'} style={inputStyle}>
          <option value="대면">대면</option>
          <option value="온라인">온라인</option>
        </select>

        <label style={labelStyle}>수업료 (원)</label>
        <input name="fee" type="number" defaultValue={student?.fee ?? ''} style={inputStyle} />

        <label style={labelStyle}>입금 상태</label>
        <select name="payment_status" defaultValue={student?.payment_status ?? '대기'} style={inputStyle}>
          <option value="대기">대기</option>
          <option value="입금완료">입금완료</option>
          <option value="미납">미납</option>
          <option value="부분입금">부분입금</option>
        </select>

        <label style={labelStyle}>메모</label>
        <textarea name="memo" rows={2} defaultValue={student?.memo ?? ''} style={{ ...inputStyle, resize: 'none' }} />

        <button type="submit" style={{ width: '100%', padding: '14px 0', borderRadius: 12, background: '#8FDCCF', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          {student ? '수정 완료' : '추가하기'}
        </button>
        <button type="button" onClick={onClose} style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 12, background: '#f7f8fa', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}>
          취소
        </button>
      </form>
    </Modal>
  );
}

// ── 학생 목록 메인 ─────────────────────────────────────────────────────────
export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [cancels, setCancels] = useState<CancelMakeup[]>([]);
  const [query, setQuery] = useState('');
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    Promise.allSettled([getStudents(), getLessons(), getCancelMakeups()])
      .then(([studentsResult, lessonsResult, cancelsResult]) => {
        if (studentsResult.status === 'fulfilled') {
          setStudents(studentsResult.value || []);
        } else {
          console.error('Failed to fetch students:', studentsResult.reason);
          setError(true);
        }

        if (lessonsResult.status === 'fulfilled') {
          setLessons(lessonsResult.value);
        } else {
          console.error('Failed to fetch lessons:', lessonsResult.reason);
          setLessons([]);
        }

        if (cancelsResult.status === 'fulfilled') {
          setCancels(cancelsResult.value);
        } else {
          console.error('Failed to fetch cancel makeups:', cancelsResult.reason);
          setCancels([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = query
    ? students.filter(s => 
        (s.name?.toLowerCase() || '').includes(query.toLowerCase()) || 
        (s.subject?.toLowerCase() || '').includes(query.toLowerCase())
      )
    : students;

  const handleSave = async (data: any) => {
    try {
      if (editStudent) {
        await updateStudent(editStudent.id, data);
      } else {
        await createStudent(data);
      }
      const updated = await getStudents();
      setStudents(updated);
      setFormOpen(false);
    } catch (err) { alert('정보 저장에 실패했습니다.'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('학생 정보를 정말 삭제하시겠습니까?')) return;
    try {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      setDetailStudent(null);
    } catch (err) { alert('삭제에 실패했습니다.'); }
  };

  return (
    <AppShell>
      <AppHeader greeting="학생 정보를 관리하세요" />
      <div className="animate-fade-in" style={{ padding: '12px 20px' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>학생 관리</div>
          <button
            onClick={() => { setEditStudent(null); setFormOpen(true); }}
            style={{ padding: '6px 12px', borderRadius: 999, background: '#8FDCCF', color: '#fff', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer' }}
          >
            + 학생 추가
          </button>
        </div>

        {/* 검색 */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={16} color="#888" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="학생 검색"
            style={{ width: '100%', borderRadius: 12, padding: '10px 12px 10px 36px', border: '1px solid #eee', background: '#f7f8fa', fontSize: 13, outline: 'none' }}
          />
        </div>

        {/* 학생 리스트 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: 14 }}>
            학생 정보를 불러오는 중...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#ff6b6b', fontSize: 14 }}>
            데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: 13 }}>
            {query ? '검색 결과가 없어요' : '학생을 추가해보세요'}
          </div>
        ) : (
          filtered.map(student => {
            const pay = PAYMENT_BADGE[student.payment_status] ?? PAYMENT_BADGE['대기'];
            return (
              <div
                key={student.id}
                onClick={() => setDetailStudent(student)}
                style={{
                  borderRadius: 20, padding: 16, marginBottom: 8, cursor: 'pointer',
                  background: '#fff', border: '1px solid #f0f0f0',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#EEF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#8FDCCF' }}>
                      {student.name?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{student.name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        {student.subject}
                        {student.regular_day ? ` · ${student.regular_day}` : ''}
                      </div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: pay.bg, color: pay.text }}>
                    {student.payment_status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 학생 상세 */}
      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          lessons={lessons}
          cancels={cancels}
          onClose={() => setDetailStudent(null)}
          onEdit={() => { setEditStudent(detailStudent); setDetailStudent(null); setFormOpen(true); }}
          onDelete={id => setStudents(prev => prev.filter(s => s.id !== id))}
        />
      )}

      {/* 학생 폼 */}
      {formOpen && (
        <StudentFormModal
          student={editStudent}
          onClose={() => { setFormOpen(false); setEditStudent(null); }}
          onSave={handleSave}
        />
      )}
    </AppShell>
  );
}
