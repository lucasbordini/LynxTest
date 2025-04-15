#!/bin/bash

# Configurações
FRAMEWORK_NAME="SDK"
WORKSPACE_NAME="DevApp"
FRAMEWORK_SCHEME="SDK"
OUTPUT_DIR="${PWD}/build/xcframework"
ARCHIVE_DIR="${PWD}/build/archives"

# Lista de frameworks adicionais para incluir
ADDITIONAL_FRAMEWORKS=(
    "libwebp"
    "Lynx"
    "LynxService"
    "PrimJS"
    "SDWebImage"
    "SDWebImageWebPCoder"
)

# Limpar diretórios anteriores
rm -rf "${OUTPUT_DIR}"
rm -rf "${ARCHIVE_DIR}"
mkdir -p "${OUTPUT_DIR}"
mkdir -p "${ARCHIVE_DIR}"

# Função para arquivar
archive() {
    local PLATFORM=$1
    local SDK=$2
    local ARCHIVE_PATH="${ARCHIVE_DIR}/${FRAMEWORK_NAME}-${PLATFORM}.xcarchive"
    
    echo "Arquivando para ${PLATFORM}..."
    
    # Adicionando mais flags para garantir compatibilidade
    xcodebuild archive \
        -workspace "${WORKSPACE_NAME}.xcworkspace" \
        -scheme "${FRAMEWORK_SCHEME}" \
        -destination "generic/platform=${PLATFORM}" \
        -sdk "${SDK}" \
        -archivePath "${ARCHIVE_PATH}" \
        SKIP_INSTALL=NO \
        BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
        ONLY_ACTIVE_ARCH=NO \
        ARCHS="arm64" \
        VALID_ARCHS="arm64" \
        SWIFT_OPTIMIZATION_LEVEL="-O" \
        SWIFT_COMPILATION_MODE=wholemodule \
        ENABLE_BITCODE=NO \
        OTHER_CFLAGS="-fembed-bitcode" \
        BITCODE_GENERATION_MODE=bitcode \
        CLANG_ENABLE_MODULES=YES \
        ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES=NO \
        CODE_SIGN_IDENTITY="-" \
        CODE_SIGNING_REQUIRED=NO \
        CODE_SIGN_STYLE=Manual \
        || exit 1

    echo "Copiando .bundle para Resources..."
    FRAMEWORK_PATH="${ARCHIVE_PATH}/Products/Library/Frameworks/${FRAMEWORK_NAME}.framework"
    mkdir -p "${FRAMEWORK_PATH}/Resources"
    cp -R "/Volumes/T7/Projects/Brightwell/ready-remit-sdk-lynx/bundle/Lynx.bundle" "${FRAMEWORK_PATH}/Resources/"
        
    echo "Arquivado com sucesso para ${PLATFORM}!"
}

remove_codesign() {
    local FRAMEWORK_PATH=$1
    
    echo "Removendo assinaturas de código de ${FRAMEWORK_PATH}..."
    
    # Remover assinaturas existentes
    find "${FRAMEWORK_PATH}" -name "_CodeSignature" -type d -exec rm -rf {} \; 2>/dev/null || true
    find "${FRAMEWORK_PATH}" -name "*.mobileprovision" -type f -exec rm -f {} \; 2>/dev/null || true
    
    # Remover atributos estendidos que podem conter informações de assinatura
    xattr -cr "${FRAMEWORK_PATH}" 2>/dev/null || true
}

# Arquivar para iOS e Simulador
archive "iOS" "iphoneos"
archive "iOS Simulator" "iphonesimulator"

# Criar XCFramework para o SDK principal
echo "Criando XCFramework para SDK..."

FRAMEWORK_PATH="Products/Library/Frameworks/${FRAMEWORK_NAME}.framework"

# Verificar se os frameworks existem antes de criar o XCFramework
if [ ! -d "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS.xcarchive/${FRAMEWORK_PATH}" ]; then
    echo "Erro: Framework para iOS não encontrado em ${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS.xcarchive/${FRAMEWORK_PATH}"
    exit 1
fi

if [ ! -d "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS Simulator.xcarchive/${FRAMEWORK_PATH}" ]; then
    echo "Erro: Framework para iOS Simulator não encontrado em ${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS Simulator.xcarchive/${FRAMEWORK_PATH}"
    exit 1
fi

# Limpar qualquer XCFramework anterior
rm -rf "${OUTPUT_DIR}/${FRAMEWORK_NAME}.xcframework"

xcodebuild -create-xcframework \
    -framework "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS.xcarchive/${FRAMEWORK_PATH}" \
    -framework "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS Simulator.xcarchive/${FRAMEWORK_PATH}" \
    -output "${OUTPUT_DIR}/${FRAMEWORK_NAME}.xcframework" || exit 1

echo "XCFramework do SDK criado com sucesso em ${OUTPUT_DIR}/${FRAMEWORK_NAME}.xcframework"

remove_codesign "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS.xcarchive/${FRAMEWORK_PATH}"
remove_codesign "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS Simulator.xcarchive/${FRAMEWORK_PATH}"

# Criar XCFrameworks para os frameworks adicionais
for ADDITIONAL_FRAMEWORK in "${ADDITIONAL_FRAMEWORKS[@]}"; do
    echo "Criando XCFramework para ${ADDITIONAL_FRAMEWORK}..."
    
    ADDITIONAL_FRAMEWORK_PATH="Products/Library/Frameworks/${ADDITIONAL_FRAMEWORK}.framework"
    
    # Verificar se os frameworks existem antes de criar o XCFramework
    if [ ! -d "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS.xcarchive/${ADDITIONAL_FRAMEWORK_PATH}" ]; then
        echo "Aviso: Framework ${ADDITIONAL_FRAMEWORK} para iOS não encontrado, pulando..."
        continue
    fi
    
    if [ ! -d "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS Simulator.xcarchive/${ADDITIONAL_FRAMEWORK_PATH}" ]; then
        echo "Aviso: Framework ${ADDITIONAL_FRAMEWORK} para iOS Simulator não encontrado, pulando..."
        continue
    fi
    
    # Limpar qualquer XCFramework anterior
    rm -rf "${OUTPUT_DIR}/${ADDITIONAL_FRAMEWORK}.xcframework"
    
    xcodebuild -create-xcframework \
        -framework "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS.xcarchive/${ADDITIONAL_FRAMEWORK_PATH}" \
        -framework "${ARCHIVE_DIR}/${FRAMEWORK_NAME}-iOS Simulator.xcarchive/${ADDITIONAL_FRAMEWORK_PATH}" \
        -output "${OUTPUT_DIR}/${ADDITIONAL_FRAMEWORK}.xcframework" || echo "Erro ao criar XCFramework para ${ADDITIONAL_FRAMEWORK}"
    
    if [ -d "${OUTPUT_DIR}/${ADDITIONAL_FRAMEWORK}.xcframework" ]; then
        echo "✅ XCFramework para ${ADDITIONAL_FRAMEWORK} criado com sucesso!"
    else
        echo "❌ Falha ao criar o XCFramework para ${ADDITIONAL_FRAMEWORK}!"
    fi
done

# Verificar se o XCFramework principal foi criado corretamente
if [ -d "${OUTPUT_DIR}/${FRAMEWORK_NAME}.xcframework" ]; then
    echo "✅ XCFramework principal criado com sucesso!"
    echo "Caminho: ${OUTPUT_DIR}/${FRAMEWORK_NAME}.xcframework"
else
    echo "❌ Falha ao criar o XCFramework principal!"
fi

echo "Processo de criação de XCFrameworks concluído!"