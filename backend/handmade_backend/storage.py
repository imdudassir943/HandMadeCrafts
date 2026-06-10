from whitenoise.storage import CompressedManifestStaticFilesStorage

class CustomCompressedManifestStaticFilesStorage(CompressedManifestStaticFilesStorage):
    manifest_strict = False
