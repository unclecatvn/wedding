import { Panel } from "@/components/admin/AdminCards";
import {
  AddButton,
  RemoveButton,
  TextInput,
  UploadInput,
} from "@/components/admin/AdminFields";
import type { WeddingContent, WeddingImage } from "@/types/wedding";

export type ImagePath =
  | "heroImage"
  | "venueImage"
  | `portraits.${number}`
  | `gallery.${number}`;

export function MediaManager({
  content,
  hasStorageConfig,
  onAddImage,
  onRemoveImage,
  onReplaceImage,
  onUpdateMainImage,
  onUpload,
  uploadingPath,
}: {
  content: WeddingContent;
  hasStorageConfig: boolean;
  onAddImage: (group: "portraits" | "gallery") => void;
  onRemoveImage: (group: "portraits" | "gallery", index: number) => void;
  onReplaceImage: (
    group: "portraits" | "gallery",
    index: number,
    image: WeddingImage,
  ) => void;
  onUpdateMainImage: (path: "heroImage" | "venueImage", image: WeddingImage) => void;
  onUpload: (file: File, path: ImagePath) => void;
  uploadingPath: ImagePath | "";
}) {
  return (
    <div className="space-y-6">
      <Panel
        title="Ảnh chính"
        description="Hero và venue là hai ảnh quan trọng nhất trong trải nghiệm cinematic."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <ImageCard
            image={content.heroImage}
            isUploading={uploadingPath === "heroImage"}
            label="Ảnh hero"
            path="heroImage"
            hasStorageConfig={hasStorageConfig}
            onChange={(image) => onUpdateMainImage("heroImage", image)}
            onUpload={onUpload}
          />
          <ImageCard
            image={content.venueImage}
            isUploading={uploadingPath === "venueImage"}
            label="Ảnh venue"
            path="venueImage"
            hasStorageConfig={hasStorageConfig}
            onChange={(image) => onUpdateMainImage("venueImage", image)}
            onUpload={onUpload}
          />
        </div>
      </Panel>

      <ImageCollection
        description="Dùng cho section story, nên giữ 2-3 ảnh portrait chất lượng cao."
        images={content.portraits}
        label="Portraits"
        group="portraits"
        hasStorageConfig={hasStorageConfig}
        onAddImage={onAddImage}
        onRemoveImage={onRemoveImage}
        onReplaceImage={onReplaceImage}
        onUpload={onUpload}
        uploadingPath={uploadingPath}
      />

      <ImageCollection
        description="Dùng cho gallery cuối trang, nên chọn ảnh đa dạng: ceremony, dinner, details."
        images={content.gallery}
        label="Gallery"
        group="gallery"
        hasStorageConfig={hasStorageConfig}
        onAddImage={onAddImage}
        onRemoveImage={onRemoveImage}
        onReplaceImage={onReplaceImage}
        onUpload={onUpload}
        uploadingPath={uploadingPath}
      />
    </div>
  );
}

function ImageCollection({
  description,
  group,
  hasStorageConfig,
  images,
  label,
  onAddImage,
  onRemoveImage,
  onReplaceImage,
  onUpload,
  uploadingPath,
}: {
  description: string;
  group: "portraits" | "gallery";
  hasStorageConfig: boolean;
  images: WeddingImage[];
  label: string;
  onAddImage: (group: "portraits" | "gallery") => void;
  onRemoveImage: (group: "portraits" | "gallery", index: number) => void;
  onReplaceImage: (
    group: "portraits" | "gallery",
    index: number,
    image: WeddingImage,
  ) => void;
  onUpload: (file: File, path: ImagePath) => void;
  uploadingPath: ImagePath | "";
}) {
  return (
    <Panel title={label} description={description}>
      <div className="grid gap-4 xl:grid-cols-2">
        {images.map((image, index) => {
          const path = `${group}.${index}` as ImagePath;
          return (
            <ImageCard
              key={`${image.src}-${index}`}
              image={image}
              isUploading={uploadingPath === path}
              label={`${label} ${index + 1}`}
              path={path}
              hasStorageConfig={hasStorageConfig}
              onChange={(nextImage) => onReplaceImage(group, index, nextImage)}
              onRemove={
                images.length > 1 ? () => onRemoveImage(group, index) : undefined
              }
              onUpload={onUpload}
            />
          );
        })}
      </div>
      <AddButton onClick={() => onAddImage(group)}>Thêm ảnh</AddButton>
    </Panel>
  );
}

function ImageCard({
  hasStorageConfig,
  image,
  isUploading,
  label,
  onChange,
  onRemove,
  onUpload,
  path,
}: {
  hasStorageConfig: boolean;
  image: WeddingImage;
  isUploading: boolean;
  label: string;
  onChange: (image: WeddingImage) => void;
  onRemove?: () => void;
  onUpload: (file: File, path: ImagePath) => void;
  path: ImagePath;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
            {label}
          </p>
          <p className="mt-1 text-xs text-stone-500">{shortUrl(image.src)}</p>
        </div>
        {onRemove ? <RemoveButton onClick={onRemove}>Xóa</RemoveButton> : null}
      </div>
      <div className="relative mb-4 h-56 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        {image.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={image.alt}
            className="h-full w-full object-cover"
            src={image.src}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            Chưa có ảnh
          </div>
        )}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm text-cream backdrop-blur-sm">
            Đang upload...
          </div>
        ) : null}
      </div>
      <div className="space-y-3">
        <TextInput
          label="Image URL"
          value={image.src}
          onChange={(src) => onChange({ ...image, src })}
        />
        <TextInput
          label="Alt text"
          value={image.alt}
          onChange={(alt) => onChange({ ...image, alt })}
        />
      </div>
      <UploadInput
        disabled={!hasStorageConfig || isUploading}
        isUploading={isUploading}
        onUpload={(file) => onUpload(file, path)}
      />
      {!hasStorageConfig ? (
        <p className="mt-2 text-xs text-stone-500">
          Cần cấu hình Supabase Storage để upload trực tiếp.
        </p>
      ) : null}
    </article>
  );
}

function shortUrl(url: string) {
  if (!url) {
    return "Chưa có URL";
  }

  return url.length > 46 ? `${url.slice(0, 43)}...` : url;
}
