import { Panel } from "@/components/admin/AdminCards";
import {
  AddButton,
  RemoveButton,
  TextArea,
  TextInput,
} from "@/components/admin/AdminFields";
import type {
  TravelNote,
  WeddingContent,
  WeddingEvent,
} from "@/types/wedding";

export function ContentEditor({
  content,
  onAddEvent,
  onAddTravelNote,
  onRemoveEvent,
  onRemoveTravelNote,
  onReplaceEvent,
  onReplaceTravelNote,
  onUpdate,
}: {
  content: WeddingContent;
  onAddEvent: () => void;
  onAddTravelNote: () => void;
  onRemoveEvent: (index: number) => void;
  onRemoveTravelNote: (index: number) => void;
  onReplaceEvent: (index: number, event: WeddingEvent) => void;
  onReplaceTravelNote: (index: number, note: TravelNote) => void;
  onUpdate: <Key extends keyof WeddingContent>(
    key: Key,
    value: WeddingContent[Key],
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <Panel
        title="Hero"
        description="Thông tin đầu tiên khách nhìn thấy khi mở website."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput
            label="Tên cặp đôi"
            value={content.coupleName}
            onChange={(value) => onUpdate("coupleName", value)}
          />
          <TextInput
            label="Eyebrow"
            value={content.eyebrow}
            onChange={(value) => onUpdate("eyebrow", value)}
          />
          <TextInput
            label="Ngày cưới"
            value={content.dateLabel}
            onChange={(value) => onUpdate("dateLabel", value)}
          />
        </div>
        <TextArea
          label="Tiêu đề hero"
          rows={3}
          value={content.heroTitle}
          onChange={(value) => onUpdate("heroTitle", value)}
        />
        <TextArea
          label="Mô tả hero"
          value={content.heroSubtitle}
          onChange={(value) => onUpdate("heroSubtitle", value)}
        />
      </Panel>

      <Panel title="Story" description="Câu chuyện của cặp đôi trên website.">
        <TextInput
          label="Tiêu đề story"
          value={content.storyTitle}
          onChange={(value) => onUpdate("storyTitle", value)}
        />
        <TextArea
          label="Nội dung story"
          rows={6}
          value={content.storyBody}
          onChange={(value) => onUpdate("storyBody", value)}
        />
      </Panel>

      <Panel title="Venue" description="Thông tin địa điểm tổ chức.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Tên địa điểm"
            value={content.venueName}
            onChange={(value) => onUpdate("venueName", value)}
          />
          <TextInput
            label="Vị trí"
            value={content.venueLocation}
            onChange={(value) => onUpdate("venueLocation", value)}
          />
        </div>
        <TextArea
          label="Mô tả địa điểm"
          rows={5}
          value={content.venueDescription}
          onChange={(value) => onUpdate("venueDescription", value)}
        />
      </Panel>

      <Panel title="Schedule" description="Timeline trong ngày cưới.">
        <div className="space-y-4">
          {content.schedule.map((event, index) => (
            <EventEditor
              key={`${event.time}-${index}`}
              event={event}
              index={index}
              onChange={(nextEvent) => onReplaceEvent(index, nextEvent)}
              onRemove={() => onRemoveEvent(index)}
            />
          ))}
        </div>
        <AddButton onClick={onAddEvent}>Thêm sự kiện</AddButton>
      </Panel>

      <Panel title="Travel" description="Ghi chú đi lại và lưu trú cho khách.">
        <div className="space-y-4">
          {content.travelNotes.map((note, index) => (
            <TravelEditor
              key={`${note.title}-${index}`}
              index={index}
              note={note}
              onChange={(nextNote) => onReplaceTravelNote(index, nextNote)}
              onRemove={() => onRemoveTravelNote(index)}
            />
          ))}
        </div>
        <AddButton onClick={onAddTravelNote}>Thêm travel note</AddButton>
      </Panel>
    </div>
  );
}

function EventEditor({
  event,
  index,
  onChange,
  onRemove,
}: {
  event: WeddingEvent;
  index: number;
  onChange: (event: WeddingEvent) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-stone-400">
        Sự kiện {index + 1}
      </p>
      <div className="grid gap-4 md:grid-cols-[0.35fr_0.65fr]">
        <TextInput
          label="Time"
          value={event.time}
          onChange={(time) => onChange({ ...event, time })}
        />
        <TextInput
          label="Title"
          value={event.title}
          onChange={(title) => onChange({ ...event, title })}
        />
      </div>
      <div className="mt-4">
        <TextArea
          label="Details"
          value={event.details}
          onChange={(details) => onChange({ ...event, details })}
        />
      </div>
      <RemoveButton onClick={onRemove}>Xóa sự kiện</RemoveButton>
    </div>
  );
}

function TravelEditor({
  index,
  note,
  onChange,
  onRemove,
}: {
  index: number;
  note: TravelNote;
  onChange: (note: TravelNote) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-stone-400">
        Travel note {index + 1}
      </p>
      <TextInput
        label="Title"
        value={note.title}
        onChange={(title) => onChange({ ...note, title })}
      />
      <div className="mt-4">
        <TextArea
          label="Description"
          value={note.description}
          onChange={(description) => onChange({ ...note, description })}
        />
      </div>
      <RemoveButton onClick={onRemove}>Xóa travel note</RemoveButton>
    </div>
  );
}
