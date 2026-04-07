'use client';

import { ChevronRight, Calendar } from 'lucide-react';
import Card from '@/components/common/Card';
import type { Lesson } from '@/lib/types';

interface TodayLessonsProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
  onAddLesson: () => void;
  onGoTodo: () => void;
}

export default function TodayLessons({
  lessons,
  onLessonClick,
  onAddLesson,
  onGoTodo,
}: TodayLessonsProps) {
  return (
    <section className="mb-6">
      <div className="text-[13px] font-semibold mb-2.5" style={{ color: '#222' }}>
        오늘 수업
      </div>

      {lessons.length === 0 ? (
        <Card className="p-6 text-center" style={{ background: '#fafbfc' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2.5"
            style={{ background: '#EEF9F6' }}
          >
            <Calendar size={24} color="#8FDCCF" />
          </div>
          <div className="text-[13px] font-semibold mb-1" style={{ color: '#222' }}>
            오늘 수업이 없어요
          </div>
          <div className="text-[12px] mb-3" style={{ color: '#888' }}>
            할 일을 체크하거나 수업을 추가해보세요
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={onGoTodo}
              className="px-4 py-2 rounded-lg text-[12px] font-medium text-white"
              style={{ background: '#8FDCCF' }}
            >
              할 일 보기
            </button>
            <button
              onClick={onAddLesson}
              className="px-4 py-2 rounded-lg text-[12px] font-medium"
              style={{ background: '#f7f8fa', color: '#222' }}
            >
              수업 추가
            </button>
          </div>
        </Card>
      ) : (
        <div>
          {lessons.map(lesson => (
            <Card
              key={lesson.id}
              className="p-3.5 mb-2.5"
              onClick={() => onLessonClick(lesson)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="text-[11px] font-semibold rounded-md px-2.5 py-1.5 text-center min-w-[50px]"
                    style={{ background: '#EEF9F6', color: '#8FDCCF' }}
                  >
                    {lesson.start_time || '-'}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold" style={{ color: '#222' }}>
                      {lesson.student_name ?? '학생'}
                    </div>
                    <div className="text-[11px]" style={{ color: '#888' }}>
                      {lesson.subject}
                      {lesson.location ? ` · ${lesson.location}` : ''}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="#888" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
